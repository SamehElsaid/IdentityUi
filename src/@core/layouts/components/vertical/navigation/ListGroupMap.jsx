import { styled } from '@mui/material/styles'
import React, { Fragment, useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { HiUsers } from 'react-icons/hi'
import { IoMdSettings } from 'react-icons/io'
import { FaUsersViewfinder } from 'react-icons/fa6'
import { GoHome } from 'react-icons/go'

const Navigation = () => {
  return [
    {
      icon: <GoHome />,
      title_en: 'Dashboard',
      title_ar: 'الرئيسية',
      path: `setting/dashboard`
    },
    {
      icon: <IoMdSettings />,
      title_en: 'Roles',
      title_ar: 'الأدوار',
      path: `setting/roles`
    },
    {
      icon: <HiUsers />,
      title_en: 'Users',
      title_ar: 'المستخدمين',
      path: `setting/users`
    },

    {
      icon: <FaUsersViewfinder />,
      title_en: 'Clients',
      title_ar: 'العملاء',
      path: `setting/clients`
    }
  ]
}

const RenderIcon = ({ iconName }) => {
  return iconName === 'radix-icons:dot' ? (
    <Icon
      fontSize='15px'
      style={{ marginInlineEnd: '0 !important', marginInlineStart: '0 !important' }}
      icon={iconName}
    />
  ) : (
    iconName
  )
}

const SidebarItem = ({ item, navHover }) => {
  const [open, setOpen] = useState(false)
  const { locale } = useRouter()
  const router = usePathname()

  const LinkStyled = styled(Link)(({ theme, isSelected }) => ({
    textDecoration: 'none',
    color: `${isSelected ? 'red' : theme.palette.text.primary} !important`,
    textAlign: locale === 'ar' ? 'right' : 'left',
    fontWeight: isSelected ? 'bold' : 'normal'
  }))

  const handleClick = () => {
    setOpen(!open)
  }

  const isPathActive = path => {
    if (router === '/' && path === '') {
      return true
    } else {
      if (router?.includes(path)) {
        return true
      } else {
        return false
      }
    }
  }

  useEffect(() => {
    if (!navHover) {
      setOpen(false)
    }
  }, [navHover])

  useEffect(() => {
    if (router?.includes(item?.path)) {
      setOpen(true)
    }
  }, [item?.path, router])

  return (
    <>
      {item.children ? (
        <div>
          <div
            onClick={handleClick}
            className={`${!navHover ? 'h_menu' : 's_menu'} menuDe ${
              item.children.map(e => router?.includes(e.path)).includes(true) ? 'active2' : ''
            }`}
            style={{ textDecoration: 'none' }}
          >
            <ListItemButton className='menu_LI_Icon'>
              <ListItemIcon sx={{ marginInlineEnd: '5px !important', marginInlineStart: '0 !important' }}>
                <RenderIcon iconName={item.icon} />
              </ListItemIcon>
              <ListItemText
                className='menu_LI_text !duration-0'
                primary={item[`title_${locale}`]}
                style={{ textAlign: locale === 'ar' ? 'right' : 'left', transition: '2s linear', fontSize: '15px' }}
              />

              <Icon
                icon='ph:caret-down-light'
                className={` ${!open ? (locale === 'ar' ? 'rotate-90' : '-rotate-90') : ''} duration-300 !text-xl`}
              />
            </ListItemButton>
          </div>
          <Collapse
            sx={{ background: ' ', margin: !navHover ? '0 10px' : '0 30px' }}
            className='!px-0'
            in={open}
            timeout='auto'
            unmountOnExit
          >
            <List component='div' disablePadding>
              {item.children.map((child, index) => (
                <Fragment key={child[`title_${locale}`]}>
                  <LinkStyled
                    className={`${!navHover ? 'h_menu' : 's_menu'} menuDe  ${
                      isPathActive('/' + child.path) ? 'active ' : ''
                    } children`}
                    href={`/${locale}/${child.path}`}
                    key={child[`title_${locale}`]}
                  >
                    <ListItemButton className='menu_LI_Icon' sx={{ pl: 4 }}>
                      <ListItemIcon
                        sx={{
                          marginInlineEnd: '5px !important',
                          marginInlineStart: '0 !important',
                          fontSize: '5px !important'
                        }}
                      >
                        <div className='!text-[5px]'>
                          <RenderIcon iconName={'radix-icons:dot'} />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        className='menu_LI_text'
                        style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}
                        primary={child[`title_${locale}`]}
                      />
                    </ListItemButton>
                  </LinkStyled>
                  <div className={`${index === item.children.length - 1 ? '!mb-3' : ''}`}></div>
                </Fragment>
              ))}
            </List>
          </Collapse>
        </div>
      ) : (
        <LinkStyled
          className={`${!navHover ? 'h_menu' : 's_menu'} menuDe ${isPathActive(item.path) ? 'active ' : ''}`}
          style={{ textDecoration: 'none' }}
          href={`/${locale}/${item.path}`}
        >
          <ListItemButton className='menu_LI_Icon'>
            <ListItemIcon sx={{ marginInlineEnd: '5px !important', marginInlineStart: '0 !important' }}>
              <RenderIcon iconName={item.icon} />
            </ListItemIcon>
            <ListItemText
              className='menu_LI_text '
              primary={item[`title_${locale}`]}
              style={{ textAlign: locale === 'ar' ? 'right' : 'left', transition: '2s linear', fontSize: '15px' }}
            />
          </ListItemButton>
        </LinkStyled>
      )}
    </>
  )
}

const ListGroupMap = ({ navHover }) => {
  const { locale } = useRouter()

  return (
    <List component='nav'>
      {Navigation().map(item => (
        <SidebarItem navHover={navHover} key={item[`title_${locale}`]} item={item} />
      ))}
    </List>
  )
}

export default ListGroupMap
